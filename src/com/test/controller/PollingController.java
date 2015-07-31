package com.test.controller;

import java.io.IOException;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.async.DeferredResult;

import com.bean.FileBean;

@Controller
public class PollingController {

	
	@Autowired
	private ApplicationContext applicationContext;
	
	public FileBean getFile() {
		return (FileBean) applicationContext.getBean("fileBean");
	}





	@RequestMapping("/start")
	public @ResponseBody String startTask(HttpServletRequest request,
            HttpServletResponse response){
		
		System.out.println(getFile().hashCode());
		if (!getFile().start()){
			return "fail";
		}
		return "Started";
	}
	
	@RequestMapping("/polling")
	public @ResponseBody  DeferredResult<String >  polling(HttpServletRequest request,
            HttpServletResponse response){
		return getFile().checkCompleted();
	}
	
	@RequestMapping(value ="/keep",method = RequestMethod.POST)
	public void keepWrite (HttpServletRequest request,
            HttpServletResponse response,@RequestParam(value="data") String data) throws IOException{
		
		for (Object s : request.getParameterMap().keySet()){
			System.out.println(s);
		}
		ServletOutputStream out = response.getOutputStream();

		for (int i =0 ; i <20 ; i++){
			System.out.println(i);
			String str="a";
			out.write(str.getBytes());
			out.flush();
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		out.close();
		
	}
	
}
