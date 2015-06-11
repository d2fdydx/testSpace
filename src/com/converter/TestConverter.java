package com.converter;

import java.io.IOException;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.springframework.core.convert.converter.Converter;

import com.test.model.City;

public class TestConverter implements Converter<String, City> {

	@Override
	public City convert(String arg0) {
		// TODO Auto-generated method stub

		ObjectMapper mapper = new ObjectMapper();
		City city = null;
		try {
			city = mapper.readValue(arg0, new TypeReference<City>() {
			});

		} catch (JsonParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JsonMappingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return city;
	}

}
