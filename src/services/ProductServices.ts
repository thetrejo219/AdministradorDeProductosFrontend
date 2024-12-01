import { safeParse,pipe,number,string,transform,parse} from "valibot";
import { DraftProductSchema, Product, ProductSchema, ProductsSchema } from "../types"
import axios from "axios";
import { toBoolean } from "../utils";

type ProductData={
    [k: string]: FormDataEntryValue;
}

export async function addProduct(data:ProductData) {
    try {
        const result = safeParse(DraftProductSchema,{
            name:data.name,
            price: +data.price

        })
        if(result.success){
            const url = `${import.meta.env.VITE_URL_FRONTEND}/api/products`
            await axios.post(url,{
                name:result.output.name,
                price:result.output.price
            })
        
        }else{
            throw new Error('Datos no validos')
        }
    } catch (error) {
        console.log(error)
    }
}

export async function getProducts() {
    try {
        const url = `${import.meta.env.VITE_URL_FRONTEND}/api/products`
        const{data:{data}}=await axios(url)
        const result = safeParse(ProductsSchema,data)
        if(result.success){
            return result.output
        }else{
            throw new Error('Hubo un error')
        }
    } catch (error) {
        console.log(error)
    }
}

export async function getProductById(id:Product['id']) {
    try {
        const url = `${import.meta.env.VITE_URL_FRONTEND}/api/products/${id}`
        const{data:{data}}=await axios(url)
        const result = safeParse(ProductSchema,data)
        if(result.success){
            return result.output
        }else{
            throw new Error('Hubo un error')
        }
    } catch (error) {
        console.log(error)
    }
}

export async function updateProduct(data:ProductData, id:Product['id']) {
   try {
        const NumberSchema = pipe(string(), transform(Number), number());
        const result=safeParse(ProductSchema,{
            id,
            name:data.name,
            price: parse(NumberSchema, data.price),
            availability:toBoolean(data.availability.toString())
        })
        if(result.success){
            const url = `${import.meta.env.VITE_URL_FRONTEND}/api/products/${id}`
            await axios.put(url,result.output)
        }
   } catch (error) {
        console.log(error)
   }
}

export async function deleteProduct(id:Product['id']) {
    try {
        const url = `${import.meta.env.VITE_URL_FRONTEND}/api/products/${id}`
        await axios.delete(url)
    } catch (error) {
        console.log(error)
    }
}

export async function updateProductAvailability(id:Product['id']) {
    try {
        const url = `${import.meta.env.VITE_URL_FRONTEND}/api/products/${id}`
        await axios.patch(url)
    } catch (error) {
        console.log(error)
    }
}