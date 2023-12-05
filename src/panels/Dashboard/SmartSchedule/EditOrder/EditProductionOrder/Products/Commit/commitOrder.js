export const CommitOrder = () => {
  return (
    <>
      <div className="py-2 px-1 bg-lightGray mx-4">
        <p className="font-bold">Verify Production Information</p>
      </div>
      <div className="flex w-full">
        <div class="flex flex-col flex-auto px-4 py-2 w-3/5">
          <div className="bg-lightGray w-fit px-2 py-1 font-bold">
            <span> Production Order Details</span>
          </div>
          <dl class="divide-y divide-lightGray text-sm w-full m-0">
            <div class="grid gap-1 py-1 sm:grid-cols-2 sm:gap-4">
              <dt class="font-medium text-gray-900 flex flex-auto">Order Id</dt>
              <dd class="text-gray-900 !m-0 flex flex-auto">23156456-651613</dd>
            </div>

            <div class="grid gap-1 py-1 sm:grid-cols-2 sm:gap-4">
              <dt class="font-medium text-gray-900">Customer</dt>
              <dd class="text-gray-900 !m-0">Production Order</dd>
            </div>

            <div class="grid gap-1 py-1 sm:grid-cols-2 sm:gap-4">
              <dt class="font-medium text-gray-900">Product</dt>
              <dd class="text-gray-900 !m-0">Colin Francis</dd>
            </div>

            <div class="grid gap-1 py-1 sm:grid-cols-2 sm:gap-4">
              <dt class="font-medium text-gray-900">Description</dt>
              <dd class="text-gray-900 !m-0">Est Possimus Quae</dd>
            </div>
            <div class="grid gap-1 py-1 sm:grid-cols-2 sm:gap-4">
              <dt class="font-medium text-gray-900">Date</dt>
              <dd class="text-gray-900 !m-0">10/03/23</dd>
            </div>
            <div class="grid gap-1 py-1 sm:grid-cols-2 sm:gap-4">
              <dt class="font-medium text-gray-900">Ordered</dt>
              <dd class="text-gray-900 !m-0">12 LBS</dd>
            </div>
            <div class="grid gap-1 py-1 sm:grid-cols-2 sm:gap-4">
              <dt class="font-medium text-gray-900">Finished</dt>
              <dd class="text-gray-900 !m-0">
                0 EA <span className="text-gray-400">(0.0% of order)</span>
              </dd>
            </div>
            <div class="grid gap-1 py-1 sm:grid-cols-2 sm:gap-4">
              <dt class="font-medium text-gray-900">Cost</dt>
              <dd class="text-gray-900 !m-0">
                $0 <span className="text-gray-400">($0.000 per EA)</span>
              </dd>
            </div>
            <div class="grid gap-1 py-1 sm:grid-cols-2 sm:gap-4">
              <dt class="font-medium text-gray-900">Base Price</dt>
              <dd class="text-gray-900 !m-0">
                $0.00{" "}
                <span className="text-gray-400">($123.00000000 per EA)</span>
              </dd>
            </div>
            <div class="grid gap-1 py-1 sm:grid-cols-2 sm:gap-4">
              <dt class="font-medium text-gray-900">Production Notes</dt>
              <dd class="text-gray-900 !m-0">1213123</dd>
            </div>
          </dl>
          <div className="bg-lightGray px-3">
            <p className="font-bold text-sm">
              <span>Total Invoice:</span> <span>$0.00</span>
            </p>
          </div>
        </div>
        <div class="flex flex-auto w-2/5 pt-5">
          <div class="md:pr-10 md:py-6">
            <div class="mb-2">
              <h4 class="font-semibold text-sm text-gray-900">Order Qty</h4>
              <p class="text-xs">Amount calculated for 12 LBS of production</p>
            </div>
            <div class="mb-2">
              <h2 class="font-semibold text-sm text-gray-900">
                Calculated Qty
              </h2>
              <p class="text-xs">AMount calculated for 0 of production</p>
            </div>
            <div class="mb-2">
              <h2 class="font-semibold text-sm text-gray-900">Actual Usage</h2>
              <p class="text-xs">Total AMount actualy removed from inventory</p>
            </div>
            <div class="mb-2">
              <h2 class="font-semibold text-sm text-gray-900">Waste</h2>
              <p class="text-xs">
                Total AMount of waste reported by the production crew
              </p>
            </div>
            <div class="mb-2">
              <h2 class="font-semibold text-sm text-gray-900">Base Price</h2>
              <p class="text-xs">
                Price per BRL multiplied by finished BRl count
              </p>
            </div>
            <div class="mb-2">
              <h2 class="font-semibold text-sm text-gray-900">
                Extra Charges after Base Price
              </h2>
              <p class="text-xs">Extra Charges for work order</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 py-2">
        <div className="bg-lightGray w-fit px-2 py-1 font-bold">
          <span> Products Used in Production</span>
        </div>
        <table class="border-collapse border !border-lightGray w-full">
          <thead>
            <tr>
              <th class="border border-gray-300 font-bold text-center bg-lightGray">
                Kit Item
              </th>
              <th class="border border-gray-300 font-bold text-center bg-lightGray">
                UOM
              </th>
              <th class="border border-gray-300 font-bold text-center bg-lightGray">
                Ordered
              </th>
              <th class="border border-gray-300 font-bold text-center bg-lightGray">
                Calculated
              </th>
              <th class="border border-gray-300 font-bold text-center bg-lightGray">
                Actual
              </th>
              <th class="border border-gray-300 font-bold text-center bg-lightGray">
                Waste
              </th>
              <th class="border border-gray-300 font-bold text-center bg-lightGray">
                Waste%
              </th>
              <th class="border border-gray-300 font-bold text-center bg-lightGray">
                InputWaste
              </th>
              <th class="border border-gray-300 font-bold text-center bg-lightGray">
                InputWaste%
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-lightGray text-right">Kit Parent</td>
              <td class="border border-lightGray text-right">LBS</td>
              <td class="border border-lightGray text-right"></td>
              <td class="border border-lightGray text-right"></td>
              <td class="border border-lightGray text-right">12</td>
              <td class="border border-lightGray text-right">12</td>
              <td class="border border-lightGray text-right">100.00%</td>
              <td class="border border-lightGray text-right"></td>
              <td class="border border-lightGray text-right"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="w-full px-4 py-2">
        <div className="bg-lightGray w-fit px-2 py-1 font-bold">
          <span> Product Finished Locations </span>
        </div>
        <table class="border-collapse border !border-lightGray w-full">
          <thead>
            <tr>
              <th class="border border-lightGray font-bold text-center bg-lightGray">
                Location
              </th>
              <th class="border border-lightGray font-bold text-center bg-lightGray">
                Qty1
              </th>
              <th class="border border-lightGray font-bold text-center bg-lightGray">
                Qty2
              </th>
              <th class="border border-lightGray font-bold text-center bg-lightGray">
                Lot #
              </th>
              <th class="border border-lightGray font-bold text-center bg-lightGray">
                Prod Date
              </th>
              <th class="border border-lightGray font-bold text-center bg-lightGray">
                Exp Date
              </th>
              <th class="border border-lightGray font-bold text-center bg-lightGray">
                LotD1
              </th>
              <th class="border border-lightGray font-bold text-center bg-lightGray">
                LotD2
              </th>
              <th class="border border-lightGray font-bold text-center bg-lightGray">
                Pallet #
              </th>
            </tr>
          </thead>
          <tbody>
            <tr></tr>
          </tbody>
        </table>
      </div>

      <div className="w-full px-4 py-2">
        <div className="bg-lightGray w-fit px-2 py-1 font-bold">
          <span>Direct Material Usage</span>
        </div>
        <table class="border-collapse border !border-lightGray w-full">
          <thead>
            <tr>
              <th class="border border-lightGray font-bold text-center bg-lightGray">
                Item
              </th>
              <th class="border border-lightGray font-bold text-center bg-lightGray">
                Unit Cost
              </th>
              <th class="border border-lightGray font-bold text-center bg-lightGray">
                Quantity
              </th>
              <th class="border border-lightGray font-bold text-center bg-lightGray">
                Cost
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-lightGray text-right">
                20in Stretch Film (Machine Wrap) WCP
              </td>
              <td class="border border-lightGray text-right">$77.19 / roll</td>
              <td class="border border-lightGray text-right">2</td>
              <td class="border border-lightGray text-right">$15.38</td>
            </tr>
            <tr>
              <td class="border border-lightGray text-right">
                18x1500 80GA Stretch Film (Hand Wrap)
              </td>
              <td class="border border-lightGray text-right">$7.76 / roll</td>
              <td class="border border-lightGray text-right">3</td>
              <td class="border border-lightGray text-right">23.28</td>
            </tr>
          </tbody>
        </table>
        <div className="bg-lightGray px-3 flex justify-end">
          <p className="font-bold text-sm">
            <span>Total Invoice:</span> <span>$177.56</span>
          </p>
        </div>
      </div>

      <div className="w-full px-4 py-2">
        <div className="bg-lightGray w-fit px-2 py-1 font-bold">
          <span>Kit Item Usage by Location</span>
        </div>
        <table class="border-collapse border !border-gray-400 w-full">
          <thead>
            <tr>
              <th class="border border-lightGray font-bold text-center bg-lightGray">
                Location
              </th>
              <th class="border border-lightGray font-bold text-center bg-lightGray">
                Item
              </th>
              <th class="border border-lightGray font-bold text-center bg-lightGray">
                Description
              </th>
              <th class="border border-lightGray font-bold text-center bg-lightGray">
                Lot#
              </th>
              <th class="border border-lightGray font-bold text-center bg-lightGray">
                LotD1
              </th>
              <th class="border border-lightGray font-bold text-center bg-lightGray">
                LotD2
              </th>
              <th class="border border-lightGray font-bold text-center bg-lightGray">
                Used
              </th>
              <th class="border border-lightGray font-bold text-center bg-lightGray">
                Cost
              </th>
              <th class="border border-lightGray font-bold text-center bg-lightGray">
                UOM
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-lightGray text-right">AS1998</td>
              <td class="border border-lightGray text-right">Kit Parent</td>
              <td class="border border-lightGray text-right">
                Testing Kit Parent
              </td>
              <td class="border border-lightGray text-right">400</td>
              <td class="border border-lightGray text-right"></td>
              <td class="border border-lightGray text-right"></td>
              <td class="border border-lightGray text-right">-12.00</td>
              <td class="border border-lightGray text-right">0.0000</td>
              <td class="border border-lightGray text-right">LBS</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
