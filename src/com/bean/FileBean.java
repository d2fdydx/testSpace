package com.bean;

import java.io.File;
import java.io.IOException;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.core.task.TaskExecutor;
import org.springframework.web.context.request.async.DeferredResult;

public class FileBean {

	
	boolean running =false;
	boolean done =false;
	FileBean me =this;
	synchronized public boolean isDone() {
		return done;
	}
	Integer progress=0;
	boolean hvProgress=false;
	  private TaskExecutor taskExecutor;
	  
	  
	public TaskExecutor getTaskExecutor() {
		return taskExecutor;
	}
	public void setTaskExecutor(TaskExecutor taskExecutor) {
		this.taskExecutor = taskExecutor;
	}
	File file=null;
	Queue <DeferredResult<String >> checkings = new ConcurrentLinkedQueue<DeferredResult<String >>();
	
	synchronized public boolean isRunning() {
		return running;
	}
	public DeferredResult<String >  checkCompleted(){
		synchronized (me){
			if (running){
				System.out.println("running");
				DeferredResult<String > res = new DeferredResult<String>();
				checkings.add(res);
			
				return res;
			}else if (done){
				System.out.println("done");
				DeferredResult<String > res = new DeferredResult<String>();
				res.setResult("done");
				return res;
			}
			
			else{
				System.out.println("not running");
				DeferredResult<String > res = new DeferredResult<String>();
				res.setResult("not running");
				return res;
			}
		}
		
	}
	public void  getFile(HttpServletRequest request,
            HttpServletResponse response){
		boolean tempdone=false;
		File tempFile=null;
		
		synchronized(this){
			try {
				wait();
			} catch (InterruptedException e1) {
				// TODO Auto-generated catch block
				
				e1.printStackTrace();
				throw new RuntimeException();
			}
			
			tempdone=done;
			
		}
		if (tempdone){
			ServletOutputStream out;
			try {
				out = response.getOutputStream();
				out.println("done!!");
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				throw new RuntimeException();
			}
		
		}else {
			throw new RuntimeException();
		}
	
	
		
	}

	 public boolean start(){
		 System.out.println(progress++);
		 synchronized(me){
			 System.out.println(running);
			if (running){
				return false;
			}
			running =true;
		 }
		 init();
		 System.out.println(taskExecutor);
		taskExecutor.execute(new Runnable() {
			
			@Override
			public void run() {
				// TODO Auto-generated method stub
				System.out.println("doing");
				doSth();
			}
		});
		return true;
		
	}
	 private void init(){
		 synchronized(me){
				
				done =false;
				
				hvProgress=false;
				File file=null;
		 }
		 
	 }
	 private void doSth(){
		 System.out.println("now sleep");
		 for (int i =0 ; i <2 ; i++){
			 try {
				Thread.sleep(2000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			 
			 
			 
			 System.out.println(i);
			 if (i!=1){
				 synchronized (me){
					 for (DeferredResult<String> der :checkings){
						 System.out.println("set i");
						 der.setResult(String.valueOf(i));
						 checkings.remove(der);
					 }
				 }
			 }else{
				 synchronized (me){
					 completed();
					 for (DeferredResult<String> der :checkings){
						 System.out.println("completed!!!");
						 if ( der.setResult("completed")){
							 System.out.println("ok");
						 }
						 checkings.remove(der);
					 }
				 }
				 
			 }
		 }
		 
	 }
	 void completed(){
		 
			done =true;
			running=false;
		 
	 }
}
