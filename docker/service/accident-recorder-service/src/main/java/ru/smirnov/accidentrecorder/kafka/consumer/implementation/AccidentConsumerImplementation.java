package ru.smirnov.accidentrecorder.kafka.consumer.implementation;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import ru.smirnov.accidentrecorder.kafka.consumer.abstraction.AccidentConsumer;
import ru.smirnov.accidentrecorder.service.abstraction.domain.PotentialAccidentService;

@Service
public class AccidentConsumerImplementation implements AccidentConsumer {

    private final PotentialAccidentService potentialAccidentService;
    private final ObjectMapper objectMapper;

    @Autowired
    public AccidentConsumerImplementation(
            PotentialAccidentService potentialAccidentService,
            ObjectMapper objectMapper
    ) {
        this.potentialAccidentService = potentialAccidentService;
        this.objectMapper = objectMapper;
    }

    @Override
    @KafkaListener(topics = "${}", groupId = "${}")
    public void consume(String jsonMessage) {

    }

}
