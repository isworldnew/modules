package ru.smirnov.accidentrecorder.kafka.consumer.abstraction;

import ru.smirnov.accidentrecorder.message.AccidentMessage;

public interface AccidentConsumer {

    void consume(String jsonMessage);

}
