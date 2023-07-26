<!--  -->
<style>
table.GeneratedTable {
  width: 100%;
  background-color: #ffffff;
  border-collapse: collapse;
  border-width: 2px;
  border-color: #ffcc00;
  border-style: solid;
  color: #000000;
}

table.GeneratedTable td, table.GeneratedTable th {
  border-width: 2px;
  border-color: #ffcc00;
  border-style: solid;
  padding: 3px;
}

table.GeneratedTable thead {
  background-color: #ffcc00;
}
</style>


`
          <table class="product">
          <thead>
              <tr>
                <th>ID</th>
                <th>Description</th>
                <th>Material</th>
                <th>Width(in)</th>
                <th>Length(in)</th>
                <th>Width(cm)</th>
                <th>Length(cm)</th>
                <th>MIL</th>
                <th>Calibre</th>
                <th>Quantity</th>
                <th>Capacity(Gallon)</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
             
              <tbody class="product-container">
                <tr>
                  <th><p>${product.id}</p> </th> 
                  <th><p>${product.description}</p> </th>
                  <th><p>${product.material}</p> </th>
                  <th><p>${product.widthIN}</p> </th>
                  <th><p>${product.lengthIN}</p> </th>
                  <th><p>${product.widthCM}</p></th>
                  <th><p>${product.lengthCM}</p> </th>
                  <th><p>${product.mil}</p> </th>
                  <th><p>${product.calibre}</p> </th>
                  <th><p>${product.quantity}</p> </th>
                  <th><p>${product.capacityGallon}</p> </th>
                  <th><p>$${product.price}</p> </th>
                  <th><button class="bag-btn" data-id=${product.id}>
                      <i class="fas fa-shopping-cart"></i>
                      </button> 
                  </th>
                </tr>
              </tbody>
          </table>
      `;