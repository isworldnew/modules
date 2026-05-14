package ru.smirnov.accidentrecorder.service.abstraction.domain;

import ru.smirnov.accidentrecorder.entity.domain.Area;

import java.util.List;

public interface AreaService {

    Area getAreaByForemanId(Long foremanId);
}
