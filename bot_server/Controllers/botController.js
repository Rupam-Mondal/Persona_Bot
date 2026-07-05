import { HiteshBotService, PiyushBotService } from "../Service/botService.js";

export async function HiteshBotController(req , res){
    try {
        const question = req?.body?.question;
        console.log(question)
        const response = await HiteshBotService(question);
        return res.json({
            success:true,
            message:"Hitesh bot responded succesfully",
            data:response
        })
    } catch (error) {
        return res.json({
            success:false,
            message:`Error message is = ${error.message}`
        })
    }
}

export async function PiyushBotController(req , res){
    try {
        const question = req?.body?.question;
        console.log(question);
        const result = await PiyushBotService(question);
        return res.json({
            success:true,
            message: "Piyush bot responded successfully",
            data: result
        })
    } catch (error) {
        return res.json({
            success: false,
            message: `Error message is = ${error.message}`
        })
    }
}