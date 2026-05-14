package ru.smirnov.accidentrecorder.mapper.implementation;

import org.springframework.stereotype.Component;
import ru.smirnov.accidentrecorder.dto.response.AreaResponse;
import ru.smirnov.accidentrecorder.dto.response.CameraResponse;
import ru.smirnov.accidentrecorder.dto.response.UserResponse;
import ru.smirnov.accidentrecorder.entity.domain.Area;
import ru.smirnov.accidentrecorder.mapper.abstraction.AreaMapper;

import java.util.List;

@Component
public class AreaMapperImplementation implements AreaMapper {

    @Override
    public AreaResponse areaEntityToAreaResponse(Area area) {
        AreaResponse areaResponse = new AreaResponse();

        if (area.getCameras() != null) {
            List<CameraResponse> cameras = area.getCameras().stream()
                    .map(camera -> new CameraResponse(
                            camera.getId(), camera.getName(),
                            area.getId(), area.getName()
                    ))
                    .toList();

            areaResponse.setCameras(cameras);
        }

        if (area.getForeman() != null) {
            UserResponse foreman = new UserResponse();
            foreman.setId(area.getForeman().getId());
            foreman.setUsername(area.getForeman().getUsername());
            foreman.setRole(area.getForeman().getRole().name());
            foreman.setStatus(area.getForeman().getStatus().name());
            foreman.setLastname(area.getForeman().getLastname());
            foreman.setFirstname(area.getForeman().getFirstname());
            foreman.setParentname(area.getForeman().getParentname());

            areaResponse.setForeman(foreman);
        }

        areaResponse.setAreaId(area.getId());
        areaResponse.setName(area.getName());

        return areaResponse;
    }

}
