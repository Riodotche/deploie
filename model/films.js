
const { parse,serialize} = require("../utils/json");

const jsonDbPath = __dirname + "/../data/films.json";

const defaulfFilms = [
    {
      id:1,
      title:"Le seigneur des loups",
      duration:120,
      budget:50000,
      link:"www.unsite.be"
    },
    {
      id:2,
      title:"Le film",
      duration:110,
      budget:10000,
      link:"www.lefilme.be"
    }
  ]

  class Films {
      constructor(dbPath = jsonDbPath,defaulItems = defaulfFilms){
          this.jsonDbPath = dbPath;
          this.defaulfFilms = defaulItems;
      }

    getNexId(){
        const films = parse(this.jsonDbPath,this.defaulfFilms);
        let nextId;
        if(films.length ===0 ) nextId = 1;
        else nextId=films[films.length -1].id +1;

        return nextId;
    }

    getAll(){
        const films = parse(this.jsonDbPath,this.defaulfFilms);
        return films;
    }
    filter(duration){
      const films = parse(this.jsonDbPath,this.defaulfFilms);
      let filterFilms = [];

      for(let i=0;i<films.length;i++){
        if(films[i].duration>=duration){
          filterFilms.push(films[i]);
        }
      }
      return filterFilms;
    }
    getOne(id){
        const films = parse(this.jsonDbPath,this.defaulfFilms);
        const foundIndex = films.findIndex((film)=>film.id == id);
        if(foundIndex<0) return;
        return films[foundIndex];
    }

    addOne(body){
        const films = parse(this.jsonDbPath,this.defaulfFilms);
        
        const newFilm = {
            id:this.getNexId(),
            title: escape(body.title),
            duration:escape(body.duration),
            budget:escape(body.budget),
            link:escape(body.link),
        };
        films.push(newFilm);
        serialize(this.jsonDbPath,films);
        return newFilm;
    }
    deleteOne(id){
        const films = parse(this.jsonDbPath,this.defaulfFilms);
        const fondIndex = films.findIndex((film)=>film.id == id);
        if(fondIndex < 0) return;
        const itemRemoved = films.splice(fondIndex,1);
        serialize(this.jsonDbPath,films);
        return itemRemoved[0];
    }
    updateOne(id,body){
      const films = parse(this.jsonDbPath,this.defaulfFilms);
      const fondIndex = films.findIndex((film)=>film.id==id);
      if(fondIndex< 0) return;

      const updateFilm = {...films[fondIndex],...body};
      films[fondIndex] = updateFilm;

      serialize(this.jsonDbPath,films);
      return updateFilm;
    }

  }

  module.exports = {Films};