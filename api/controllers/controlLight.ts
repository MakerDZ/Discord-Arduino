import { RouterContext } from "https://deno.land/x/oak@v12.5.0/router.ts";
import { Lights } from "../models/lightModel.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.2/mod.ts";


// Controller For Default Response
const welcome = (ctx : RouterContext<'/'>) => {
    ctx.response.body = "Welcome From The Deno Land.";
}

// API Testing Endpoint
const testEndpoint = (ctx : RouterContext<'/api/v1'>) => {
    try{
        ctx.response.status = 200;
        ctx.response.body = {
            status : true,
            message : 'You are authorized to access this endpoint.'
        }
    }catch(error){
        console.log(`Response error: ${error}`);
        ctx.response.status = 500;
        ctx.response.body = {
            status : false,
            message : error
        }
    }
}


// Controller To Fetch Created Light Counts
const getLightCount = async (ctx : RouterContext<'/api/v1/lightcount'>) => {
    try{
        const count = await Lights.countDocuments();
        ctx.response.status = 200;
        ctx.response.body = {
            count
        }
    }catch(error){
        console.log(`Response error: ${error}`);
        ctx.response.status = 500;
        ctx.response.body = {
            status : false,
            message : error
        }
    }
}


// Controller To Fetch All Lights
const getAllLights = async (ctx: RouterContext<'/api/v1/lights'>) => {
    try{
        const count = await Lights.countDocuments();
        if(count != 0){
            const lightsCursor = await Lights.find();
            const lights = await lightsCursor.toArray();
            ctx.response.status = 200;
            ctx.response.body = lights;
        }else{
            ctx.response.status = 200;
            ctx.response.body = [
                {
                    index : 0,
                    name : 'No lights found',
                    status : false
                }
            ]
        }
    }catch(error){
        console.log(`Response error: ${error}`);
        ctx.response.status = 500;
        ctx.response.body = {
            status : false,
            message : error
        }
    }
};


// Controller To Get Light By Id
const getLight = async (ctx: RouterContext<'/api/v1/getlight/:id'>) => {
    try {
        const index : number = +ctx.params.id ;
        const light = await Lights.findOne({ index : index  });
        ctx.response.status = 200;
        ctx.response.body = light;
    } catch (error) {
        console.log(`Response error: ${error}`);
        ctx.response.status = 500;
        ctx.response.body = {
            status : false,
            message : error
        }
    }
  };


// Controller To Create New Light
const createLight = async (ctx : RouterContext<'/api/v1/createlight'>) => {
    try{
        const total_lights : number = 8;
        const reqBodyRaw  = await ctx.request.body().value;
        const name : string = reqBodyRaw.name;
        const count = await Lights.countDocuments();
        if(count < total_lights){
            await Lights.insertOne({
                index : count+1,
                name : name,
                status : false
            })
            const createdLight = await Lights.findOne({ index : count + 1})
            ctx.response.status = 200;
            ctx.response.body = {
                status : true,
                message : 'You successfully created new light.',
                data : createdLight
            };
        }else{
            ctx.response.status = 200;
            ctx.response.body = {
                status : false,
                message : 'You already created max light.'
            }
        }  
    }catch(error){
        console.log(`There was an error while creating newl light. Error: ${error}`)
        ctx.response.status = 500;
        ctx.response.body = {
            status : false,
            message : error
        }
    }
}


// Controller To Update Light Status By Id
const updateLight = async (ctx : RouterContext<'/api/v1/updatelight/:id'>) => {
    try{
        const reqBodyRaw  = await ctx.request.body().value;
        const status : boolean = reqBodyRaw.status;
        const index : number = +ctx.params.id ;
        await Lights.updateOne({ index : index } , { $set : { status : status }}); 
        const updatedLight = await Lights.findOne({ index : index});
        ctx.response.status = 200;
        ctx.response.body = updatedLight;
    }catch(error){
        console.log(`Response error: ${error}`);
        ctx.response.status = 500;
        ctx.response.body = {
            status : false,
            message : error
        }
    }
}

// Controller To Update Light
const deleteLight = async (ctx : RouterContext<'/api/v1/deletelight'>) => {
    try{
        const count = await Lights.countDocuments();
        const deleteLight = await Lights.deleteOne({ index : count })
        if(deleteLight == 1){
            ctx.response.status = 200;
            ctx.response.body = {
                status : true,
                message : "Successfully deleted"
            }
        }
    }catch(error){
        console.log(`Response error: ${error}`);
        ctx.response.status = 500;
        ctx.response.body = {
            status : false,
            message : error
        }
    }
}

export { welcome, testEndpoint, getLightCount, getAllLights, getLight , createLight , updateLight , deleteLight}