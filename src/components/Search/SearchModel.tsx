import { Typography } from "@mui/material";
import React, { useRef, useState,useEffect} from "react";
import { SearchInput } from "./SearchInput";
import { useMeal } from "../../services/hooks/useMeal";
import { Loader } from "../loaders/Loader";
import { SearchServices } from "./SearchServices";
import { Link } from "react-router-dom";

export type modal = {
    isOpened:boolean|"loaded",
    setOpened:Function
}
  

let currentValue = "";
let currentList = [] as any[];
export const SearchModel:React.FC<modal> = ({isOpened,setOpened}:modal) =>{
    const modal = useRef<HTMLElement|null>(null);
    const [searchValue,setSearchValue] = useState<string>("");
    const [searchResult,setSearchResult] = useState<"template"|"loading"|any[]>("template");
    const meal = useMeal();
    
    useEffect(()=>{
        if(searchValue.trim().length === 1 && currentValue !== searchValue){
            (async ()=>{
                currentValue = searchValue;
                setSearchResult("loading");
                const result = await meal.getMealByLetter({letter:searchValue[0]});
                currentList = result;
                setSearchResult(result);
            })()
        }
        if(!searchValue.trim() || !searchValue){
            setSearchResult("template");
            currentValue="";
        }
        if(searchValue.length>1 && typeof searchResult === "object" && searchResult !== null){
            const comparison = SearchServices.findMatch({value:searchValue,data:searchResult});
            setSearchResult(comparison.length?comparison:currentList);
        }
    },[searchValue])
    if(isOpened === "loaded"){
        return <></>
    }
    return <section className={`modal ${isOpened?"show":"closed"}`} ref={modal} onClick={(e)=>{e.target===modal.current && setOpened(false)
    }}>
            <div className="search-modal">
                    <SearchInput value={searchValue} setValue={setSearchValue}/>                
                    <div className="search-modal__result" style={{height:SearchServices.calculateHeight(searchResult)}}>
                        {searchResult === "template" && <Typography className="search-modal__result--placeholder">Type something...</Typography>}
                        {searchResult === "loading" && <Loader/>}
                        {typeof searchResult === "object" && searchResult !== null && searchResult.map(dish=>{
                            return  <React.Fragment  key={dish.idMeal}><Link to={`/dish/${dish.idMeal}`}className="search-modal__result--item">
                                <Typography >{dish.strMeal}</Typography>
                            </Link><br/>
                            </React.Fragment>
                        })}
                    </div>
            </div>
        </section>
}