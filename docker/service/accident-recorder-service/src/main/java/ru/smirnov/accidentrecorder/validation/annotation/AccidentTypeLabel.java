package ru.smirnov.accidentrecorder.validation.annotation;

import jakarta.validation.Constraint;
import ru.smirnov.accidentrecorder.validation.validator.AccidentTypeValidator;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.TYPE})
@Constraint(validatedBy = AccidentTypeValidator.class)
@Documented
public @interface AccidentTypeLabel {
}
