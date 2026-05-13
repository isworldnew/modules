package ru.smirnov.accidentrecorder.validation.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.ReportStatus;
import ru.smirnov.accidentrecorder.validation.annotation.ReportStatusLabel;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

public class ReportStatusValidator implements ConstraintValidator<ReportStatusLabel, String> {

    @Override
    public boolean isValid(String status, ConstraintValidatorContext constraintValidatorContext) {

        Set<String> reportStatuses = Arrays.stream(ReportStatus.values())
                .map(reportStatus -> reportStatus.name())
                .collect(Collectors.toSet());

        if (!reportStatuses.contains(status.toUpperCase())) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate(
                    "Report's status valid values are: " + Arrays.toString(ReportStatus.values())
            ).addConstraintViolation();
            return false;
        }

        return true;
    }
}
