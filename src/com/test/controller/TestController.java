package com.test.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.test.model.City;
import com.test.model.Service;

@Controller
public class TestController {

	@RequestMapping("/index")
	public ModelAndView index() {
		return new ModelAndView("hello");

	}

	@RequestMapping("/welcome")
	public ModelAndView helloWorld() {

		String message = "<br><div style='text-align:center;'>"
				+ "<h3>********** Hello World, Spring MVC Tutorial</h3>This message is coming from CrunchifyHelloWorld.java **********</div><br><br>";

		ModelAndView view = new ModelAndView("welcome");
		view.addObject("message2", message);
		return view;
	}

	@RequestMapping(value = "/getJson")
	public ResponseEntity<Service> get() {
		City[] cities = new City[4];
		for (int i = 0; i < 4; i++) {
			cities[i] = new City();
			cities[i].setName(String.valueOf("abacfadsf" + String.valueOf(i)));
			cities[i].setId(i);
		}
		Service service = new Service();
		service.setObjects(cities);
		return new ResponseEntity<Service>(service, HttpStatus.OK);
	}

	@RequestMapping(value = "/submit",method={RequestMethod.POST})
	public @ResponseBody Service sumbit(@RequestBody City json) {
		System.out.println(json.getName());
		
		City[] cities = new City[4];
		for (int i = 0; i < 4; i++) {
			cities[i] = new City();
			cities[i].setName(String.valueOf("abacfadsf" + String.valueOf(i)));
			cities[i].setId(i);
		}
		Service service = new Service();
		service.setObjects(cities);
		return service;
		
	}

	@RequestMapping(value = "/update",method={RequestMethod.POST})	
	public @ResponseBody Service update(@RequestBody String json) {
		
		System.out.println("update");
		Service service = new Service();
		return service;
		
	}	
	@RequestMapping(value = "/delete",method={RequestMethod.POST})	
	public @ResponseBody Service delete(@RequestBody String json) {
		
		System.out.println("update");
		Service service = new Service();
		service.setSuccess(false);
		return service;
		
	}	
	
	/*
	@InitBinder
	public void initBinder(WebDataBinder dataBinder) {
	    dataBinder.registerCustomEditor(City.class, new PropertyEditorSupport() {
	        Object value;
	        @Override
	        public Object getValue() {
	            return value;
	        }

	        @Override
	        public void setAsText(String text) throws IllegalArgumentException {
	        	ObjectMapper mapper = new ObjectMapper();
	    		City city = null;
	    		try {
	    			city = mapper.readValue(text, new TypeReference<City>() {
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
	    		value =city;
	        }
	    });
	}
	*/
}
