package ru.smirnov.accidentrecorder.validation.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import ru.smirnov.accidentrecorder.validation.validator.ReportStatusValidator;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Constraint(validatedBy = ReportStatusValidator.class)
@Documented
public @interface ReportStatusLabel {

    String message() default "Invalid report status";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}