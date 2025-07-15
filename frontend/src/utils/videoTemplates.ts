// utils/videoTemplates.ts
export interface VideoTemplate {
  id: string;
  name: string;
  platform: string;
  width: number;
  height: number;
  aspectRatio: string;
  fps: number;
  description: string;
  icon: string;
  recommended?: boolean;
  maxDuration?: number; // in seconds
}

export interface TransitionEffect {
  id: string;
  name: string;
  description: string;
  preview?: string;
}

export const VIDEO_TEMPLATES: VideoTemplate[] = [
  {
    id: 'youtube-landscape',
    name: 'YouTube Landscape',
    platform: 'YouTube',
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
    fps: 30,
    description: 'Video hướng dẫn, vlog, phỏng vấn, tiêu chuẩn YouTube',
    icon: '📺',
    recommended: true
  },
  {
    id: 'instagram-post',
    name: 'Instagram Post',
    platform: 'Instagram',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    fps: 30,
    description: 'Bài đăng định dạng vuông',
    icon: '⬜',
    maxDuration: 60
  },
  {
    id: 'facebook-video',
    name: 'Facebook Video',
    platform: 'Facebook',
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
    fps: 30,
    description: 'Bài đăng video trên Facebook',
    icon: '👥'
  },
  {
    id: 'twitter-video',
    name: 'Twitter Video',
    platform: 'Twitter/X',
    width: 1280,
    height: 720,
    aspectRatio: '16:9',
    fps: 30,
    description: 'Bài đăng video trên Twitter/X',
    icon: '🐦',
    maxDuration: 140
  },
  {
    id: 'linkedin-video',
    name: 'LinkedIn Video',
    platform: 'LinkedIn',
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
    fps: 30,
    description: 'Nội dung chuyên nghiệp cho LinkedIn',
    icon: '💼'
  },
  {
    id: 'custom',
    name: 'Custom',
    platform: 'Custom',
    width: 1920,
    height: 1080,
    aspectRatio: 'Tùy chỉnh',
    fps: 30,
    description: 'Đặt kích thước của riêng bạn',
    icon: '⚙️'
  }
];

export const TRANSITION_EFFECTS: TransitionEffect[] = [
  {
    id: 'fade',
    name: 'Mờ dần',
    description: 'Hiệu ứng mờ dần vào/ra'
  },
  {
    id: 'slide',
    name: 'Trượt',
    description: 'Hiệu ứng trượt từ bên này sang bên kia'
  },
  {
    id: 'zoom',
    name: 'Phóng to',
    description: 'Hiệu ứng phóng to/thu nhỏ'
  },
  {
    id: 'wipe',
    name: 'Lướt',
    description: 'Lướt qua màn hình'
  },
  {
    id: 'dissolve',
    name: 'Hòa tan',
    description: 'Hiệu ứng hòa tan dần giữa các cảnh'
  },
  {
    id: 'none',
    name: 'Không chuyển tiếp',
    description: 'Cắt trực tiếp giữa các cảnh'
  }
];

export const FPS_OPTIONS = [
  { value: 24, label: '24 FPS', description: 'Điện ảnh' },
  { value: 30, label: '30 FPS', description: 'Chuẩn' },
  { value: 60, label: '60 FPS', description: 'Mượt mà' }
];

export const FIT_MODES = [
  { value: 'cover', label: 'Cover', description: 'Lấp đầy màn hình, có thể cắt (Đề xuất)' },
  { value: 'fill', label: 'Fill', description: 'Kéo dài đến kích thước chính xác' }
];