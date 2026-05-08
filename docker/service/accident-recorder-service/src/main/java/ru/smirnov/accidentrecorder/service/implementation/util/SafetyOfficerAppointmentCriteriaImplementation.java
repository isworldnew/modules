package ru.smirnov.accidentrecorder.service.implementation.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.smirnov.accidentrecorder.repository.audience.UserRepository;
import ru.smirnov.accidentrecorder.service.abstraction.util.SafetyOfficerAppointmentCriteria;

@Component
public class SafetyOfficerAppointmentCriteriaImplementation implements SafetyOfficerAppointmentCriteria {

    private final UserRepository userRepository;

    @Autowired
    public SafetyOfficerAppointmentCriteriaImplementation(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Long appoint() { // логика назначения инцидента на сотрудника отдела ТБ
        return this.userRepository.getEnabledSafetyOfficerIdentifiers().get(0);
    }

}
