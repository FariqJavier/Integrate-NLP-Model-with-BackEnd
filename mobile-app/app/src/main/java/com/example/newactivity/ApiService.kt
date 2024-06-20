package com.example.newactivity
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {
    @POST("your-endpoint")
    fun sendData(@Body userInput: UserInput): Call<Void>
}