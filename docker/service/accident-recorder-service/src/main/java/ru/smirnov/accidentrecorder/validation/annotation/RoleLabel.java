package ru.smirnov.accidentrecorder.validation.annotation;


import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import ru.smirnov.accidentrecorder.validation.validator.RoleValidator;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Constraint(validatedBy = RoleValidator.class)
@Documented
public @interface RoleLabel {

    String message() default "Invalid role value";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
