package ru.smirnov.accidentrecorder.validation.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import ru.smirnov.accidentrecorder.validation.validator.DocumentTypeValidator;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Constraint(validatedBy = DocumentTypeValidator.class)
@Documented
public @interface DocumentTypeLabel {

    String message() default "Invalid document type";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
