package com.movemate.server.util;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import javax.xml.parsers.DocumentBuilderFactory;
import java.io.StringReader;
import java.util.Optional;

public class XmlUtils {

    private static Document loadXml(String xmlContent) {
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            factory.setNamespaceAware(false);
            return factory.newDocumentBuilder().parse(new InputSource(new StringReader(xmlContent)));
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse XML", e);
        }
    }

    public static NodeList getNodeListByTag(String xml, String tagName) {
        Document doc = loadXml(xml);
        return doc.getElementsByTagName(tagName);
    }

    public static Optional<String> getTextContent(Element element, String tagName) {
        NodeList nodes = element.getElementsByTagName(tagName);
        if (nodes == null || nodes.getLength() == 0 || nodes.item(0) == null) {
            return Optional.empty();
        }
        String text = nodes.item(0).getTextContent();
        return text != null && !text.isBlank() ? Optional.of(text) : Optional.empty();
    }

    public static String getText(Element element, String tagName, String defaultValue) {
        return getTextContent(element, tagName).orElse(defaultValue);
    }

    public static int getInt(Element element, String tagName, int defaultValue) {
        return getTextContent(element, tagName)
                .map(text -> {
                    try {
                        return Integer.parseInt(text.trim());
                    } catch (NumberFormatException ex) {
                        return defaultValue;
                    }
                })
                .orElse(defaultValue);
    }

    public static double getDouble(Element element, String tagName, double defaultValue) {
        return getTextContent(element, tagName)
                .map(text -> {
                    try {
                        return Double.parseDouble(text.trim());
                    } catch (NumberFormatException ex) {
                        return defaultValue;
                    }
                })
                .orElse(defaultValue);
    }
}
