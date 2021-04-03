import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import Image from "./image/Image";
import Bread from "./breadcrumb/Bread";
import Info from "./info/Info";
import Description from "./description/Description";
import { UserContext } from "../contexts/UserContext";

export default function Detail() {
  const [product, setProduct] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [user] = useContext(UserContext);
  const [colorId, setColorId] = useState(0);
  const slug = useParams();
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/product/${slug.id}`)
      .then((response) => {
        setProduct(response.data);
        setColorId(response.data.colors[0].id);
      });
  }, [slug.id]);
  return (
    <main className="mains" style={{ padding: "20px 0" }}>
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <Bread subCategory={product.sub} />
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12">
            <Image images={product.images} />
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12">
            <Info
              id={slug.id}
              product={product}
              colors={product.colors}
              quantity={quantity}
              productId={product.id}
              price={product.price}
              discount={product.discount}
              userId={user.id}
              colorId={colorId}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              setColorId={setColorId}
              setQuantity={setQuantity}
            />
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12">
            <Description images={product.images} />
          </div>
        </div>
      </div>
    </main>
  );
}
