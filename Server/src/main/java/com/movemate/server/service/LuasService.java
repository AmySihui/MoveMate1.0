package com.movemate.server.service;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
public class LuasService {

    public ResponseEntity<String> getForecast(String stop) {
        String apiUrl = "https://luasforecasts.rpa.ie/xml/get.ashx?action=forecast&stop=" + stop + "&encrypt=false";
        try {
            RestTemplate restTemplate = new RestTemplate();
            restTemplate.getMessageConverters().removeIf(c -> c instanceof StringHttpMessageConverter);
            restTemplate.getMessageConverters().add(new StringHttpMessageConverter(StandardCharsets.UTF_8));

            String result = restTemplate.getForObject(apiUrl, String.class);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_XML)
                    .body(result);
        } catch (Exception e) {
            System.err.println("LUAS Forecast API error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body("LUAS forecast fetch failed: " + e.getMessage());
        }
    }

    public ResponseEntity<String> getStopId(String name) {
        Map<String, String> stopIdMap = Map.ofEntries(
                Map.entry("Abbey Street", "ABB"),
                Map.entry("Balally", "BAL"),
                Map.entry("Beechwood", "BCH"),
                Map.entry("Blackhorse", "BLA"),
                Map.entry("Bluebell", "BLU"),
                Map.entry("Brides Glen", "BRD"),
                Map.entry("Busáras", "BUS"),
                Map.entry("Charlemont", "CHA"),
                Map.entry("Cheeverstown", "CHE"),
                Map.entry("Cherrywood", "CHW"),
                Map.entry("Citywest Campus", "CYC"),
                Map.entry("Citywest Hotel", "CYH"),
                Map.entry("Connolly", "CON"),
                Map.entry("Cookstown", "COO"),
                Map.entry("Cowper", "COW"),
                Map.entry("Dawson", "DAW"),
                Map.entry("Drimnagh", "DRI"),
                Map.entry("Dundrum", "DUN"),
                Map.entry("Fatima", "FAT"),
                Map.entry("Fettercairn", "FET"),
                Map.entry("George's Dock", "GEO"),
                Map.entry("Goldenbridge", "GOL"),
                Map.entry("Heuston", "HUS"),
                Map.entry("Jervis", "JER"),
                Map.entry("Kilmacud", "KIL"),
                Map.entry("Kingswood", "KIN"),
                Map.entry("Kylemore", "KYE"),
                Map.entry("Marlborough", "MAR"),
                Map.entry("Mayor Square", "MAY"),
                Map.entry("Milltown", "MIL"),
                Map.entry("Museum", "MUS"),
                Map.entry("O'Connell GPO", "OGP"),
                Map.entry("O'Connell Upper", "OCU"),
                Map.entry("Parnell", "PAR"),
                Map.entry("Ranelagh", "RAN"),
                Map.entry("Red Cow", "RED"),
                Map.entry("Rialto", "RIA"),
                Map.entry("Sandyford", "SAN"),
                Map.entry("Spencer Dock", "SPE"),
                Map.entry("St. Stephen's Green", "STS"),
                Map.entry("Suir Road", "SUI"),
                Map.entry("Tallaght", "TAL"),
                Map.entry("Trinity", "TRI"),
                Map.entry("Windy Arbour", "WIN")
        );

        String cleanedName = name.replaceAll("\\s*-\\s*", " ").replaceAll("\\s+", " ").trim();
        String stopId = stopIdMap.get(cleanedName);
        if (stopId == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not Found");
        }
        return ResponseEntity.ok(stopId);
    }
}
