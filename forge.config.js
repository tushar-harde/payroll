module.exports = {
  makers: [
    {
      name: "@electron-forge/maker-deb",
      config: {
        options: {
          maintainer: "Tushar Harde",
          homepage: "https://blocksone.tech",
        },
      },
    },
    {
      name: "@electron-forge/maker-wix",
      config: {
        language: 1033,
        manufacturer: "Blocksone private limited",
      },
    },
  ],
};
