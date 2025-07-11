package com.hcmus.softdes.aivideocreator.application.service;

import com.hcmus.softdes.aivideocreator.application.common.repositories.VideoRepository;
import com.hcmus.softdes.aivideocreator.application.dto.video.VideoDto;
import com.hcmus.softdes.aivideocreator.domain.enums.Platform;
import com.hcmus.softdes.aivideocreator.domain.enums.Status;
import com.hcmus.softdes.aivideocreator.domain.model.Video;
import com.hcmus.softdes.aivideocreator.infrastructure.external.r2storage.R2Client;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class VideoService {
    private final VideoRepository videoRepository;
//    private final AssestmentRepository assignmentRepository;
    private R2Client r2Client;


    public VideoService(VideoRepository videoRepository, R2Client r2Client) {
        this.r2Client = r2Client;
        this.videoRepository = videoRepository;
        if (videoRepository == null) {
            throw new IllegalArgumentException("VideoRepository cannot be null");
        }
        if (r2Client == null) {
            throw new IllegalArgumentException("R2Client cannot be null");
        }
    }

    public void createVideo(VideoDto videoDto) {
        if (videoDto.getTitle() == null || videoDto.getDescription() == null || videoDto.getUserId() == null) {
            throw new IllegalArgumentException("Video title, description, and file path cannot be null");
        }
        if (videoDto.getUserId() == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        Video videoData = Video.create(videoDto.getTitle(), videoDto.getDescription(), videoDto.getFilePath(), Status.PENDING, Platform.NONE, 0, videoDto.getProjectId(), videoDto.getUserId());

        videoRepository.saveVideo(videoData);
        if (videoRepository.getVideo(videoData.getId()) == null) {
            throw new RuntimeException("Failed to create video");
        }
    }

    public Video getVideo(UUID videoId) {
        Video video = videoRepository.getVideo(videoId);
        if (video == null) {
            throw new RuntimeException("Video not found");
        }
        return video;
    }

    public void deleteVideo(UUID videoId) {
        if (videoId == null) {
            throw new IllegalArgumentException("Video ID cannot be null");
        }
        videoRepository.deleteVideo(videoId);
        r2Client.deleteVideo(videoId.toString());
        if (videoRepository.getVideo(videoId) != null) {
            throw new RuntimeException("Failed to delete video");
        }
    }

    public List<Video> getVideosByUserId(UUID userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        return videoRepository.getVideosByUserId(userId);
    }
}
