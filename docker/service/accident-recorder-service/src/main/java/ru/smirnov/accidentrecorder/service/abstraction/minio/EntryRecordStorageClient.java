package ru.smirnov.accidentrecorder.service.abstraction.minio;

import java.io.InputStream;

public interface EntryRecordStorageClient {
    InputStream downloadRecord(String reference);
}
