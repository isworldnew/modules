package ru.smirnov.accidentrecorder.mapper.abstraction;

import ru.smirnov.accidentrecorder.entity.audience.User;
import ru.smirnov.accidentrecorder.entity.domain.Area;
import ru.smirnov.accidentrecorder.entity.relation.OperatedArea;

public interface OperatedAreaMapper {

    OperatedArea createOperatedArea(User foreman, User safetyOfficer, Area area);
}
