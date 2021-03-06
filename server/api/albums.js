const albumRouter = require("express").Router();

const {
  models: { Album, Artist },
} = require("../db");

// Path: /api/albums
albumRouter.get("/", async (req, res, next) => {
  try {
    const albums = await Album.findAll();
    res.send(albums);
  } catch (error) {
    next(error);
  }
});

// GET /api/albums/:albumId
albumRouter.get("/:albumId", async (req, res, next) => {
  try {
    const singleAlbum = await Album.findByPk(req.params.albumId, {
      include: {
        model: Artist,
      },
    });
    res.json(singleAlbum);
  } catch (error) {
    console.log("GET single album error", error);
    next(error);
  }
});

/* *************** FOR ADMIN *************** */

albumRouter.delete("/", async (req, res, next) => {
  try {
    const toBeDeleted = await Album.findByPk(req.body.id);

    await toBeDeleted.destroy();
    res.send(toBeDeleted);
  } catch (error) {
    console.log("DELETE ALBUM ERROR", error);
    next(error);
  }
});

albumRouter.post("/", async (req, res, next) => {
  try {
    // find artist by name
    let createArtist = false;

    let artistSearch = await Artist.findOne({
      where: {
        name: req.body.artistName,
      },
    });

    // if !artist, make new artist
    if (!artistSearch) {
      artistSearch = await Artist.create({ name: req.body.artistName });
      createArtist = true;
    }
    //make new album and with artist Id coming from artist
    const newAlbum = await Album.create({
      title: req.body.title,
      artistId: artistSearch.id,
      price: req.body.price,
      releaseYear: req.body.releaseYear,
      // need to upload cover art
    });

    if (createArtist) {
      res.send({ artistSearch, newAlbum });
    } else {
      res.send(newAlbum);
    }
  } catch (error) {
    next(error);
  }
});

albumRouter.put("/:albumId", async (req, res, next) => {
  try {
    // let createArtist = false;
    // let artistSearch = await Artist.findOne({
    //   where: {
    //     name: req.body.artistName,
    //   },
    // });

    // // if !artist, make new artist
    // if (!artistSearch) {
    //   artistSearch = await Artist.create({ name: req.body.artistName });
    //   createArtist = true;
    // }

    const albumId = req.params.albumId;
    const updatedAlbum = await Album.findByPk(albumId);
    //await updatedAlbum.update(req.body);
    // if (createArtist) {
    //   res.send(updatedAlbum, artistSearch);
    // }
    res.send(await updatedAlbum.update(req.body));
  } catch (error) {
    next(error);
  }
});

module.exports = albumRouter;
