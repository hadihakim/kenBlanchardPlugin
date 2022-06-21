const apiCall = async () => {
  let post;
  try {
    let res = await fetch("https://fakestoreapi.com/products?limit=20");
    post = await res.json();
    return post;
  } catch (error) {
    console.log(error);
  }
};

