package ru.smirnov.accidentrecorder.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class DocumentResponse {
    private String content; // base64
    private String contentType;
    private String fileName;
    private Long documentId;
}
