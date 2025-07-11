package com.hcmus.softdes.aivideocreator.application.dto.video;

import com.hcmus.softdes.aivideocreator.domain.enums.Platform;
import com.hcmus.softdes.aivideocreator.domain.enums.Status;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@SuperBuilder
@Getter
@Setter
public class VideoDto {
    private String title;
    private String description;
    private String filePath;
    private UUID projectId;
    private UUID userId;
}
