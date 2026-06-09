package ru.smirnov.accidentrecorder.validation.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.AccidentType;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.DocumentType;
import ru.smirnov.accidentrecorder.validation.annotation.DocumentTypeLabel;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

public class DocumentTypeValidator implements ConstraintValidator<DocumentTypeLabel, String> {

    @Override
    public boolean isValid(String type, ConstraintValidatorContext constraintValidatorContext) {

        Set<String> documentTypes = Arrays.stream(DocumentType.values())
                .map(documentType -> documentType.name())
                .collect(Collectors.toSet());

        if (!documentTypes.contains(type.toUpperCase())) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate(
                    "Document's type valid values are: " + Arrays.toString(DocumentType.values())
            ).addConstraintViolation();
            return false;
        }

        return true;
    }
}
