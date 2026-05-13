package ru.smirnov.accidentrecorder.mapper.implementation;

import org.springframework.stereotype.Component;
import ru.smirnov.accidentrecorder.dto.request.TrespasserCreationRequest;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.TrespasserRelation;
import ru.smirnov.accidentrecorder.entity.domain.Trespasser;
import ru.smirnov.accidentrecorder.mapper.abstraction.TrespasserMapper;

@Component
public class TrespasserMapperImplementation implements TrespasserMapper {

    @Override
    public Trespasser trespasserCreationRequestToTrespasserEntity(TrespasserCreationRequest dto) {
        Trespasser trespasser = new Trespasser();

        trespasser.setTrespasserName(dto.getName());
        trespasser.setPost(dto.getPost());
        trespasser.setTrespasserRelation(TrespasserRelation.valueOf(dto.getRelation()));
        trespasser.setOrganizationEmail(dto.getEmail());

        return trespasser;
    }

}
