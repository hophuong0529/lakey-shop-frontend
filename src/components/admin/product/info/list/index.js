import {
  ExclamationTriangleFill,
  PencilFill,
  Search,
  TrashFill,
} from "react-bootstrap-icons";
import React, { Fragment, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import "./index.css";
import Paginate from "../../../../pagination/Paginate";
import no_image from "../../../../../assets/images/no-image.png";
import { Modal } from "antd";

const ProductList = (props) => {
  const [products, setProducts] = useState([]);
  const [perPage, setPerPage] = useState(0);
  const [totalItemsPage, setTotalItemsPage] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [product, setProduct] = useState({});
  const [key, setKey] = useState("");
  const history = useHistory();
  const keyword = props.location.search.substr(3);
  const [title, setTilte] = useState("");

  const showModal = (selectProduct) => {
    setIsModalVisible(true);
    setProduct(selectProduct);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (!keyword) {
      axios.get("http://127.0.0.1:8000/api/products").then((response) => {
        setProducts(response.data.data);
        setPerPage(response.data.per_page);
        setTotalItemsPage(response.data.total);
      });
    } else {
      axios
        .get(`http://127.0.0.1:8000/api/products/search/${keyword}`)
        .then((response) => {
          setProducts(response.data.products.data);
          setPerPage(response.data.products.per_page);
          setTotalItemsPage(response.data.products.total);
          setTilte(response.data.keyword);
        });
    }
  }, [keyword]);

  const handlePageChange = (pageNumber) => {
    if (!keyword) {
      axios
        .get("http://127.0.0.1:8000/api/products?page=" + pageNumber)
        .then((response) => {
          setProducts(response.data.data);
          setActivePage(pageNumber);
        });
    } else {
      axios
        .get(
          `http://127.0.0.1:8000/api/products/search/${keyword}?page=` +
            pageNumber
        )
        .then((response) => {
          setProducts(response.data.products.data);
          setActivePage(pageNumber);
        });
    }
  };

  const handleDelete = (item) => {
    const productId = item.id;
    axios
      .post(`http://127.0.0.1:8000/api/product/delete`, { productId })
      .then(() => {
        alert("X??a s???n ph???m th??nh c??ng.");
        setProducts(products.filter((x) => x.id !== item.id));
      })
      .catch((error) => {
        alert("R???t ti???c, b???n kh??ng th??? x??a s???n ph???m n??y.");
        console.log(error);
      });
  };

  return (
    <>
      <div
        className="button-add"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginRight: 20,
          marginBottom: 5,
        }}
      >
        <Link className="btn btn-add" to="/admin/product/create">
          Th??m s???n ph???m m???i
        </Link>
      </div>
      <div className="card-top">
        <div className="title">
          <h2>Danh s??ch c??c s???n ph???m</h2>
        </div>
        <form
          className="form-search"
          style={{ marginLeft: "auto", whiteSpace: "nowrap" }}
        >
          <div
            className="input-group"
            style={{ width: 320, border: "1px solid #d7d7d7" }}
          >
            <input
              className="form-control"
              type="text"
              name="q"
              placeholder={"T??m ki???m s???n ph???m"}
              onChange={(e) => setKey(e.target.value)}
              style={{ fontSize: 14 }}
            />
            <span className="input-group-btn">
              <button
                className="btn btn-pink"
                onClick={(e) => {
                  e.preventDefault();
                  history.push("/admin/products/search?q=" + key);
                }}
              >
                <Search />
              </button>
            </span>
          </div>
        </form>
      </div>
      {title ? (
        <span className="result-search-prd">
          -- K???t qu??? t??m ki???m t??? kh??a "<b>{title}</b>" --
        </span>
      ) : (
        <></>
      )}
      <Modal
        style={{ left: 105 }}
        visible={isModalVisible}
        title="Th??ng tin chi ti???t s???n ph???m"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="modal-pro">
          <h4 style={{ marginBottom: 0 }}>{product.name}</h4>
          <br />
          <b>M?? s???n ph???m:</b> {product.code}&emsp;&emsp;
          <b>Danh m???c s???n ph???m:</b> {product.sub?.name}
          <br />
          <b>M??u s???c: </b>
          <span>
            {product.colors?.map((color) => (
              <span key={color.id}>
                {color.name} (S??? l?????ng: {color.quantity}) &emsp;&emsp;
              </span>
            ))}
          </span>
          &emsp;&emsp;
          <b>S???n ph???m b??n ch???y: </b>
          {product.is_top === 1 ? "C??" : "Kh??ng"}
          <br />
          <b>Gi?? nh???p:</b> {product.price_import?.toLocaleString()}{" "}
          VN??&emsp;&emsp;
          <b>Gi?? b??n:</b> {product.price?.toLocaleString()} VN??&emsp;&emsp;
          <b>Gi???m gi??:</b> {product.discount}% <br />
          <b>Nh?? cung c???p: </b>
          {product.producer?.name} <br />
          <b>Ng??y t???o:</b> {product.created_at} <br />
          <b>M?? t???:&nbsp;</b>
          <span
            className="descrip-pro"
            dangerouslySetInnerHTML={{
              __html: product.description,
            }}
          ></span>
          <br />
          <b>H??nh ???nh:</b>
          <div className="container-fluid imgProduct">
            <div className="row">
              {product.images?.map((img) => (
                <div className="col-md-3" key={img.id}>
                  <img
                    src={process.env.REACT_APP_URL_IMAGE + img.path}
                    alt=""
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
      <div className="card-body">
        <table className="table table-striped">
          <thead>
            <tr>
              <th style={{ width: "7%" }}>ID</th>
              <th style={{ width: "10%" }}>M?? s???n ph???m</th>
              <th style={{ width: "20%" }}>H??nh ???nh</th>
              <th style={{ width: "23%" }}>T??n</th>
              <th style={{ width: "12%" }}>Gi?? b??n</th>
              <th style={{ width: "9%" }}>S??? l?????ng</th>
              <th style={{ width: "9%" }}>Gi???m gi??</th>
              <th style={{ width: "10%" }}></th>
            </tr>
          </thead>
          <tbody className="list-product">
            {products.map((product) => (
              <Fragment key={product.id}>
                <tr>
                  <td>
                    {product.quantity === 0 ? (
                      <ExclamationTriangleFill
                        style={{ color: "#e10000", marginTop: -4 }}
                      />
                    ) : (
                      <></>
                    )}
                    &nbsp;
                    {product.id}
                  </td>
                  <td>{product.code}</td>
                  <td className="prd-image" onClick={() => showModal(product)}>
                    {product.images[0] ? (
                      <img
                        src={
                          process.env.REACT_APP_URL_IMAGE +
                          product.images[0].path
                        }
                        alt=""
                      />
                    ) : (
                      <img src={no_image} alt="" style={{ width: "50%" }} />
                    )}
                  </td>
                  <td className="prd-name" onClick={() => showModal(product)}>
                    {product.name}
                  </td>
                  <td>{product.price.toLocaleString()} VN??</td>
                  <td
                    style={{
                      color: product.quantity === 0 ? "#e10000" : "",
                    }}
                  >
                    {product.quantity}
                  </td>
                  <td>{product.discount}%</td>
                  <td style={{ textAlign: "right" }}>
                    <Link
                      to={"/admin/product/edit/" + product.id}
                      style={{
                        paddingRight: "20px",
                        color: "black",
                        textDecoration: "none",
                      }}
                    >
                      <PencilFill />
                    </Link>
                    <button
                      onClick={() => {
                        if (window.confirm("B???n mu???n x??a s???n ph???m n??y?"))
                          handleDelete(product);
                      }}
                      style={{
                        color: "#9e312c",
                        paddingRight: "20px",
                        border: "none",
                        background: "none",
                      }}
                    >
                      <TrashFill />
                    </button>
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
        <Paginate
          activePage={activePage}
          itemsCountPerPage={perPage}
          totalItemsCount={totalItemsPage}
          onChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default ProductList;
