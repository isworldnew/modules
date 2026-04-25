package ru.smirnov.accidentrecorder.kafka.consumer.abstraction;

public interface AccidentConsumer {

    void consume(String jsonMessage);

}
