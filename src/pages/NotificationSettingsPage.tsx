import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';
import { ArrowLeft, Bell, Volume1, Volume2, VolumeX, Play, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import './NotificationSettingsPage.css';

const SOUNDS = [
  { id: 'default', name: 'Mặc định (Tiếng chuông)', url: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3' },
  { id: 'chime', name: 'Nhẹ nhàng (Chime)', url: 'https://assets.mixkit.co/active_storage/sfx/2868/2868-preview.mp3' },
  { id: 'alert', name: 'Cảnh báo (Tiếng còi)', url: 'https://assets.mixkit.co/active_storage/sfx/2867/2867-preview.mp3' },
  { id: 'custom', name: 'Tự chèn âm thanh...' },
];

export const NotificationSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [volume, setVolume] = useState(80);
  const [selectedSound, setSelectedSound] = useState('default');
  const [customAudioPath, setCustomAudioPath] = useState<string | null>(null);
  const [customAudioFile, setCustomAudioFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!user) return;
    const loadSettings = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from('user_settings').select('*').eq('user_id', user.id).single();
      if (!error && data) {
        setVolume(data.volume);
        setSelectedSound(data.selected_sound);
        setCustomAudioPath(data.custom_audio_path);
        
        if (data.custom_audio_path) {
          // Note: bucket is not public, so getPublicUrl might not work for direct src if RLS is strict. 
          // Actually, we must use createSignedUrl or download. Let's use download for playing.
        }
      }
      setIsLoading(false);
    };
    loadSettings();
  }, [user]);

  // Handle playing audio from storage or local blob
  const playCustomAudio = async () => {
    if (customAudioFile) {
      const url = URL.createObjectURL(customAudioFile);
      const audio = new Audio(url);
      audio.volume = volume / 100;
      audio.play();
    } else if (customAudioPath) {
      const { data } = await supabase.storage.from('notification-audio').download(customAudioPath);
      if (data) {
        const url = URL.createObjectURL(data);
        const audio = new Audio(url);
        audio.volume = volume / 100;
        audio.play();
      }
    } else {
      alert('Chưa có âm thanh tùy chỉnh nào.');
    }
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX size={24} />;
    if (volume < 50) return <Volume1 size={24} />;
    return <Volume2 size={24} />;
  };

  const playSound = (soundId: string) => {
    const sound = SOUNDS.find(s => s.id === soundId);
    if (!sound) return;

    if (soundId === 'custom') {
      playCustomAudio();
    } else if (sound.url) {
      const audio = new Audio(sound.url);
      audio.volume = volume / 100;
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    let finalPath = customAudioPath;
    
    if (selectedSound === 'custom' && customAudioFile) {
      const filePath = `${user.id}/${customAudioFile.name}`;
      const { error: uploadError } = await supabase.storage.from('notification-audio').upload(filePath, customAudioFile, { upsert: true });
      if (uploadError) {
        alert('Lỗi tải file âm thanh: ' + uploadError.message);
        setIsSaving(false);
        return;
      }
      finalPath = filePath;
    }

    const payload = {
      user_id: user.id,
      volume,
      selected_sound: selectedSound,
      custom_audio_path: selectedSound === 'custom' ? finalPath : null
    };

    const { error } = await supabase.from('user_settings').upsert(payload);
    
    if (error) {
      alert('Không thể lưu cài đặt: ' + error.message);
    } else {
      alert('Đã lưu cài đặt thông báo!');
      navigate('/account');
    }
    setIsSaving(false);
  };

  return (
    <PageContainer>
      <div className="settings-bg-dark">
        <div className="settings-header">
          <button className="settings-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
          <h1>Cài đặt thông báo</h1>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.6)' }}>Đang tải cài đặt...</div>
        ) : (
          <>
        <input 
          type="file" 
          accept=".mp3,.wav,.ogg" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              if (file.size > 5 * 1024 * 1024) {
                alert('File âm thanh quá lớn. Vui lòng chọn file dưới 5MB.');
                return;
              }
              setCustomAudioFile(file);
              setSelectedSound('custom');
            }
          }}  
        />

        <div className="settings-section">
          <h2 className="settings-section-title">
            Âm lượng
          </h2>
          <div className="settings-control-group">
            <div className="volume-slider-container">
              {getVolumeIcon()}
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="volume-slider"
              />
              <span style={{ minWidth: '40px', textAlign: 'right', fontWeight: 600 }}>{volume}%</span>
            </div>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>
              Điều chỉnh âm lượng to hay nhỏ khi có thông báo tới.
            </p>
          </div>
        </div>

        <div className="settings-section">
          <h2 className="settings-section-title">
            <Bell size={20} color="#ffffff" /> Âm thanh thông báo
          </h2>
          <div className="settings-control-group">
            {SOUNDS.map(sound => (
              <div
                key={sound.id}
                className={`sound-option ${selectedSound === sound.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedSound(sound.id);
                  if (sound.id === 'custom') {
                    fileInputRef.current?.click();
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {selectedSound === sound.id && <Check size={18} color="#ffffff" />}
                  <span className="sound-name" style={{ marginLeft: selectedSound === sound.id ? 0 : '30px' }}>
                    {sound.name}
                  </span>
                </div>
                <button
                  className="sound-play-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    playSound(sound.id);
                  }}
                  title="Nghe thử"
                >
                  <Play size={20} fill="currentColor" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="settings-actions">
          <button className="btn-save-settings" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
        </>
        )}
      </div>
    </PageContainer>
  );
};
