package ru.smirnov.accidentrecorder.validation.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.AccidentType;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.ResponseType;
import ru.smirnov.accidentrecorder.validation.annotation.ResponseTypeLabel;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

public class ResponseTypeValidator implements ConstraintValidator<ResponseTypeLabel, String> {

    @Override
    public boolean isValid(String type, ConstraintValidatorContext constraintValidatorContext) {

        Set<String> responseTypes = Arrays.stream(ResponseType.values())
                .map(responseType -> responseType.name())
                .collect(Collectors.toSet());

        if (!responseTypes.contains(type.toUpperCase())) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate(
                    "Response's type valid values are: " + Arrays.toString(ResponseType.values())
            ).addConstraintViolation();
            return false;
        }

        return true;
    }
}
