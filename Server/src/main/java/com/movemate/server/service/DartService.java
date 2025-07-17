package com.movemate.server.service;

import com.movemate.server.dto.DartRealtimeDTO;
import com.movemate.server.dto.DartStationDTO;
import com.movemate.server.util.XmlUtils;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class DartService {

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String STATIONS_URL = "http://api.irishrail.ie/realtime/realtime.asmx/getAllStationsXML_WithStationType?StationType=D";

    private static final String REALTIME_BY_STATION_URL = "http://api.irishrail.ie/realtime/realtime.asmx/getStationDataByNameXML?StationDesc=%s";

    @Cacheable("dartStations")
    public List<DartStationDTO> getAllStations() {
        try {
            String xml = restTemplate.getForObject(STATIONS_URL, String.class);
            NodeList nodes = XmlUtils.getNodeListByTag(xml, "objStation");

            List<DartStationDTO> result = new ArrayList<>();
            for (int i = 0; i < nodes.getLength(); i++) {
                Element e = (Element) nodes.item(i);
                DartStationDTO station = new DartStationDTO();
                station.setStationDesc(XmlUtils.getText(e, "StationDesc", ""));
                station.setStationCode(XmlUtils.getText(e, "StationCode", ""));
                station.setLatitude(XmlUtils.getDouble(e, "StationLatitude", 0));
                station.setLongitude(XmlUtils.getDouble(e, "StationLongitude", 0));
                result.add(station);
            }
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch Dart stations", e);
        }
    }

    @Cacheable(value = "dartStationRealtime", key = "#stationDesc", unless = "#result == null || #result.isEmpty()")
    public List<DartRealtimeDTO> getRealtimeByStation(String stationDesc) {
        String url = String.format(REALTIME_BY_STATION_URL, stationDesc);
        try {
            String xml = restTemplate.getForObject(url, String.class);
            NodeList nodes = XmlUtils.getNodeListByTag(xml, "objStationData");
            List<DartRealtimeDTO> result = new ArrayList<>();

            for (int i = 0; i < nodes.getLength(); i++) {
                Element e = (Element) nodes.item(i);
                DartRealtimeDTO dto = new DartRealtimeDTO();
                dto.setTrainCode(XmlUtils.getText(e, "Traincode", ""));
                dto.setOrigin(XmlUtils.getText(e, "Origin", ""));
                dto.setDestination(XmlUtils.getText(e, "Destination", ""));
                dto.setExpArrival(XmlUtils.getText(e, "Exparrival", ""));
                dto.setExpDeparture(XmlUtils.getText(e, "Expdepart", ""));
                dto.setStatus(XmlUtils.getText(e, "Status", ""));
                dto.setDirection(XmlUtils.getText(e, "Direction", ""));
                dto.setDueIn(XmlUtils.getInt(e, "Duein", 0));
                dto.setLate(XmlUtils.getInt(e, "Late", 0));
                dto.setLastLocation(XmlUtils.getText(e, "Lastlocation", ""));
                result.add(dto);
            }
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch real-time data for station: " + stationDesc, e);
        }
    }

    public String getLinesGeoJson() {
        try (InputStream is = new ClassPathResource("line1.geojson").getInputStream()) {
            return new String(is.readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load DART GeoJSON", e);
        }
    }
    public String getStationsGeoJson() {
        return readResourceFile("station.geojson");
    }

    private String readResourceFile(String fileName) {
        try (InputStream is = getClass().getClassLoader().getResourceAsStream(fileName)) {
            if (is == null) throw new RuntimeException("GeoJSON not found: " + fileName);
            return new String(is.readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read GeoJSON: " + fileName, e);
        }
    }

}


