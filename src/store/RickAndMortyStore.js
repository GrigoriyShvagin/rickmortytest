import { defineStore } from "pinia";
import axios from "axios";

const RICK_AND_MORTY_URL = `${process.env.VUE_APP_RICK_AND_MORTY_URL}`;

export const useRickMortyStore = defineStore("rickMorty", {
  state: () => {
    return { charactersListData: {}, episodesListData: [], idsList: [] };
  },
  getters: {
    charactersList: (state) => state.charactersListData,
    episodesList: (state) => state.episodesListData,
    listOfIds: (state) => state.idsList,
  },
  actions: {
    getId(str) {
      let splittedStr = str.split("/");
      let id = splittedStr[splittedStr.length - 1];
      return id;
    },

    async getCharactersList(page, status, name) {
      let params = { page, status, name };

      const result = await axios.get(`${RICK_AND_MORTY_URL}/character/`, {
        params,
      });

      let resultData = result.data.results;
      resultData.forEach((elem) => {
        let id = this.getId(elem.episode[0]);
        if (!this.idsList.includes(id)) {
          this.idsList.push(id);
        }
      });

      this.$state.charactersListData = result.data;
      this.getCurrentEpisode(this.idsList);
      return result;
    },

    async getCurrentEpisode(idsList) {
      let notInList = [];

      idsList.forEach((id) => {
        if (!this.episodesListData.some((elem) => this.getId(elem.url) == id)) {
          notInList.push(id);
        }
      });
      if (notInList.length) {
        const result = await axios.get(
          `${RICK_AND_MORTY_URL}/episode/${notInList.join(",")}`
        );
        console.log(result.data.length);
        if (notInList.length == 1) {
          this.episodesListData.push({
            name: result.data.name,
            url: result.data.url,
          });
        } else {
          result.data.forEach((elem) => {
            this.episodesListData.push({ name: elem.name, url: elem.url });
          });
        }

        return result;
      }
    },
  },
});
