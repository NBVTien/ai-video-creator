package com.hcmus.softdes.aivideocreator.api.mappers;

import com.hcmus.softdes.aivideocreator.application.dto.video.VideoDto;
import com.hcmus.softdes.aivideocreator.domain.model.Video;

import java.util.UUID;

public class VideoMapper {
    public static Video toVideo(VideoDto videoDto) {
        return new Video(
            UUID.randomUUID(),
            videoDto.getTitle(),
            videoDto.getDescription(),
            videoDto.getFilePath(),
            null, // Status is not provided in VideoDto, set to null or default
            null, // Platform is not provided in VideoDto, set to null or default
            0, // Duration is not provided in VideoDto, set to 0 or default
            videoDto.getProjectId(),
            videoDto.getUserId()
        );
    }

    public static VideoDto toVideoDto(Video video) {
        return VideoDto.builder()
            .title(video.getTitle())
            .description(video.getDescription())
            .filePath(video.getFilePath())
            .projectId(video.getProjectId())
            .userId(video.getUserId())
            .build();
    }
}
