import React, { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export const NotificationManager: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const checkNotifications = async () => {
      const now = new Date();
      const currentDayOfWeek = now.getDay();
      
      const { data: settingsData } = await supabase.from('user_settings').select('*').eq('user_id', user.id).single();
      const settings = settingsData || { volume: 80, selected_sound: 'default', custom_audio_path: null };
      
      const { data: tasks } = await supabase.from('tasks').select('*').eq('user_id', user.id).eq('is_completed', false);
      const { data: schedules } = await supabase.from('schedules').select('*').eq('user_id', user.id).eq('day_of_week', currentDayOfWeek);
      
      const notifiedRaw = localStorage.getItem('notified_items');
      const notified: Record<string, boolean> = notifiedRaw ? JSON.parse(notifiedRaw) : {};

      let shouldNotify = false;
      let notificationMessage = '';

      // Check Tasks
      if (tasks) {
        for (const task of tasks) {
          if (!task.deadline) continue;
          const deadlineDate = new Date(task.deadline);
          const timeDiffMinutes = (deadlineDate.getTime() - now.getTime()) / (1000 * 60);
          
          if (timeDiffMinutes <= 1 && timeDiffMinutes >= -1 && !notified[`task_${task.id}`]) {
            shouldNotify = true;
            notificationMessage = `Đến hạn bài tập: ${task.title}`;
            notified[`task_${task.id}`] = true;
          }
        }
      }

      // Check Schedules
      if (schedules) {
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();

        for (const schedule of schedules) {
          if (!schedule.start_time) continue;
          const [startH, startM] = schedule.start_time.split(':').map(Number);
          const scheduleTimeMin = startH * 60 + startM;
          const nowTimeMin = currentHours * 60 + currentMinutes;
          
          if (scheduleTimeMin - nowTimeMin === 5 && !notified[`schedule_${schedule.id}_${now.toDateString()}`]) {
            shouldNotify = true;
            notificationMessage = `Sắp đến giờ học: ${schedule.subject} (${schedule.start_time.substring(0, 5)})`;
            notified[`schedule_${schedule.id}_${now.toDateString()}`] = true;
          }
        }
      }

      if (shouldNotify) {
        localStorage.setItem('notified_items', JSON.stringify(notified));
        
        if (Notification.permission === 'granted') {
          new Notification('Sổ Học Tập', { body: notificationMessage });
        } else {
          alert(notificationMessage);
        }

        const SOUNDS = [
          { id: 'default', url: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3' },
          { id: 'chime', url: 'https://assets.mixkit.co/active_storage/sfx/2868/2868-preview.mp3' },
          { id: 'alert', url: 'https://assets.mixkit.co/active_storage/sfx/2867/2867-preview.mp3' },
        ];
        
        if (settings.selected_sound === 'custom') {
          if (settings.custom_audio_path) {
            const { data } = await supabase.storage.from('notification-audio').download(settings.custom_audio_path);
            if (data) {
              const url = URL.createObjectURL(data);
              const audio = new Audio(url);
              audio.volume = settings.volume / 100;
              audio.play().catch(console.error);
            }
          }
        } else {
          const soundDef = SOUNDS.find(s => s.id === settings.selected_sound);
          if (soundDef) {
            const audio = new Audio(soundDef.url);
            audio.volume = settings.volume / 100;
            audio.play().catch(console.error);
          }
        }
      }
    };

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    checkNotifications();
    const intervalId = setInterval(checkNotifications, 30000);

    return () => clearInterval(intervalId);
  }, [user]);

  return null;
};
