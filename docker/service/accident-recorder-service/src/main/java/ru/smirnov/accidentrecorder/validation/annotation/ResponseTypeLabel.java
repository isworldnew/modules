package ru.smirnov.accidentrecorder.validation.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import ru.smirnov.accidentrecorder.validation.validator.ResponseTypeValidator;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Constraint(validatedBy = ResponseTypeValidator.class)
@Documented
public @interface ResponseTypeLabel {

    String message() default "Invalid response type";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
