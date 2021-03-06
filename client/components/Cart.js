import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  checkout,
  fetchAlbumsInCart,
  removeAlbumsFromCart,
} from "../redux/cart";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Zoom } from "@mui/material";

class Cart extends Component {
  constructor(props) {
    super(props);
    this.removeAlbum = this.removeAlbum.bind(this);
    this.completePurchase = this.completePurchase.bind(this);
  }

  componentDidMount() {
    if (this.props.isLoggedIn) {
      this.props.fetchAlbums(); // added component did mount function
    } else {
      let localCart = localStorage.getItem("CART");
      if (!localCart) {
        return;
      } else {
        const guestUser = JSON.parse(localStorage.getItem("CART"));
        console.log("guest user", guestUser);
        this.setState({ albums: guestUser });
      }
    }
  }

  fixPrice(price) {
    return price / 100;
  }

  calculateCartTotal(albums) {
    return albums
      .map(({ price, quantity }) => price * quantity)
      .reduce((sum, i) => sum + i, 0);
  }

  removeAlbum(albumId) {
    if (this.props.isLoggedIn) {
      this.props.removeAlbums(albumId);
    } else {
      const guestAlbums = JSON.parse(window.localStorage.getItem("CART"));
      const updatedAlbums = guestAlbums.filter((album) => album.id !== albumId);
      window.localStorage.setItem("CART", JSON.stringify(updatedAlbums));
      console.log(
        "Removed an album from localstorage cart",
        JSON.parse(guestAlbums)
      );
      this.setState({ albums: updatedAlbums });
    }
  }

  completePurchase() {
    this.props.checkout();
  }

  render() {
    const { completePurchase } = this;
    const albums = this.props.isLoggedIn
      ? this.props.cart.albums
      : JSON.parse(window.localStorage.getItem("CART"));


    if (!albums || albums.length === 0) {
      return (
        <>
          <h1 className="cart-title">Shopping Cart</h1>
          <h1>EMPTY</h1>
        </>
      );
    } else {
      const invoiceTotal = this.calculateCartTotal(albums);
      return (
        <div className="cart-container">
          <h1 className="cart-title">Shopping Cart</h1>
          <TableContainer component={Paper} class="cart-table">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={3}>
                    Details
                  </TableCell>
                  <TableCell align="right">Qty</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Artist</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {albums.map((product) => (
                  <TableRow key={product.title}>
                    <TableCell component="th" scope="row">
                      <img id="cart-img" src={product.cover} />
                    </TableCell>
                    <TableCell>{product.title}</TableCell>
                    {/* TODO: add artist to product */}
                    <TableCell>{product.artist.name}</TableCell>
                    {/* <TableCell align="right">{product.quantity}</TableCell> */}
                    {/* <TableCell align="right">${this.fixPrice(product.orderAlbum.cost * product.orderAlbum.quantity)}</TableCell> */}
                    <TableCell align="right">
                      <button onClick={() => this.removeAlbum(product.id)}>
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell rowSpan={2} />
                  <TableCell align="right" colSpan={3}>
                    <b>Total</b>
                  </TableCell>
                  <TableCell align="right">
                    ${this.fixPrice(invoiceTotal)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <div id="checkout-tools">
            {/* LINK IS A PLACEHOLDER */}
            <Link to={`/confirmed/1`}>
              <button type="submit" onClick={() => completePurchase()}>
                Complete Purchase!
              </button>
            </Link>
          </div>
        </div>
      );
    }
  }
}

const mapState = (state) => ({
  cart: state.cart,
  userId: state.auth.id,
  isLoggedIn: !!state.auth.id,
});

const mapDispatch = (dispatch) => ({
  fetchAlbums: () => dispatch(fetchAlbumsInCart()),
  removeAlbums: (albumId) => dispatch(removeAlbumsFromCart(albumId)),
  checkout: () => dispatch(checkout()),
});

export default connect(mapState, mapDispatch)(Cart);
