package com.hcmus.softdes.aivideocreator.application.dto.voice;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class TtsResponse {
    String audioUrl;
    String format;
    int duration;
    String ProjectId;
}
