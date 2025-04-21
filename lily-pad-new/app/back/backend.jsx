import AsyncStorage from '@react-native-async-storage/async-storage';

export const SaveP = async (value) => {
    try{
        await AsyncStorage.setItem('pos', value)  //saving position
    } catch (e){
        console.log(e)
    }
}

export const SaveF = async (value) => {
    value++; //add 1 as it passed 1 lower
    try{
        await AsyncStorage.setItem('count', value)
    } catch (e){
        console.log(e)
    }
    
}

export const GetKeys = async () => {
    let pos //declaring variables
    let ct
    try{
        pos = await AsyncStorage.getItem('pos') //grabbing the saved values
        ct = await AsyncStorage.getItem('count')
    } catch(e){
        console.log(e)
    }
    const position = parseInt(pos, 10); //chaning the string values to ints
    const count = parseInt(ct, 10);
    let keys = [position, count]; //setting as an array
    return keys; //passing the array
}