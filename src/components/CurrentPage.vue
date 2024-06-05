<template>
  <div
    class="flex w-11/12 justify-center flex-col items-center text-3xl text-white"
  >
    <div class="flex justify-between w-10/12 p-10 text-2xl text-white">
      <div class="cursor-pointer" @click="getCharactersList(page - 1)">
        Стрелочка влево
      </div>

      <div class="flex w-1/2 justify-between items-center text-black text-xl">
        <input
          type="text"
          v-model="characterName"
          placeholder="Введите имя"
          class="p-4 w-52 rounded-2xl h-12"
        />
        <select name="status" v-model="characterStatus" class="p-3 rounded-xl">
          <option>dead</option>
          <option>alive</option>
          <option>unknown</option>
        </select>

        <button
          type="button"
          @click="getCharactersList()"
          class="bg-black_card text-white p-3 rounded-xl"
        >
          Применить
        </button>
      </div>

      <div class="cursor-pointer" @click="getCharactersList(page + 1)">
        Стрелочка вправо
      </div>
    </div>

    <div class="flex flex-wrap justify-between w-10/12">
      <div
        class="flex justify-between cardProperties rounded-lg my-3 mx-4 bg-black_card overflow-hidden w-[45%]"
        v-for="item in listOfCharacters"
        :key="item.id"
      >
        <div class="imgFlex w-full">
          <img :src="item.image" class="w-full h-full object-cover" />
        </div>
        <div class="infoFlex flex flex-col p-3">
          <div class="flex-1 flex flex-col">
            <h2 class="text-xl font-medium text-white">{{ item.name }}</h2>
            <h2 class="text-xs font-medium flex items-center text-white">
              <span
                :class="{
                  red: item.status == 'Dead',
                  green: item.status == 'Alive',
                  gray: item.status == 'unknown',
                }"
                class="rounded-full h-2 w-2 mr-1 text-xl font-medium block"
              ></span>
              <div class="">{{ item.status }} - {{ item.species }}</div>
            </h2>
          </div>
          <div class="flex flex-1">
            <div class="text-xs text_gray">
              Last known location:
              <p class="text-16px text-white font-medium">
                {{ item.location.name }}
              </p>
            </div>
          </div>
          <div class="flex flex-1">
            <div class="text-xs text_gray">
              First seen in:
              <p class="text-16px text-white font-medium">
                {{ checkEpisodes(item.episode[0]) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRickMortyStore } from "@/store/RickAndMortyStore";
export default {
  name: "CurrentPage",
  data: () => ({
    rickMortyStore: useRickMortyStore(),
    notInList: [],
    characterName: "",
    characterStatus: "",
    page: null,
    status: null,
    name: null,
  }),
  methods: {
    getId(str) {
      let splittedStr = str.split("/");
      let id = splittedStr[splittedStr.length - 1];
      return id;
    },
    initParams() {
      const { page, status, name } = this.$route.query;
      this.page = +page || 1;
      this.status = status;
      this.name = name;
    },

    checkEpisodes(str) {
      const allEpisodes = this.rickMortyStore.$state.episodesListData;
      const firstEpisode = allEpisodes.find((elem) => elem.url == str);
      return firstEpisode?.name;
    },

    getCharactersList(page) {
      if (page < 1) return;
      this.$router.push({
        path: "/",
        query: {
          page: page,
          status: this.characterStatus,
          name: this.characterName,
        },
      });
      this.rickMortyStore.getCharactersList(
        page,
        this.characterStatus,
        this.characterName
      );
    },
  },
  computed: {
    listOfCharacters() {
      return this.rickMortyStore.charactersList.results;
    },
    listOfEpisodes() {
      return this.rickMortyStore.episodesList;
    },
    listOfIds() {
      return this.rickMortyStore.listOfIds;
    },
  },
  mounted() {
    this.initParams();
    this.getCharactersList(this.page);
  },
  watch: {
    "$route.query"() {
      this.initParams();
    },
  },
};
</script>

<style>
.text-16px {
  font-size: 16px;
}
.text_gray {
  color: rgb(158, 158, 158);
}
.cardProperties {
  max-width: 600px;
  max-height: 220px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
    rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
}
.imgFlex {
  flex: 2 1 0%;
}
.infoFlex {
  flex: 3 1 0%;
}
.gray {
  background: rgb(158, 158, 158);
}
.red {
  background: rgb(214, 61, 46);
}
.green {
  background: rgb(85, 204, 68);
}
</style>
