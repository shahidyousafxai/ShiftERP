import { useEffect, useState } from "react";
import { PagingPanel } from "@devexpress/dx-react-grid-material-ui";
const CustomPagination = (restProps) => {
  const [pages, setPages] = useState([]);
  const [pagesNextState, setPagesNextState] = useState(false);
  const [pagesPreviouseState, setPagesPreviousState] = useState(false);
  const [lastLimit, setLastLimit] = useState(false);
  const [startingRecords, setStartingRecords] = useState(1);
  const [endingRecords, setEndingRecords] = useState(restProps.pageSize);

  let goToPageArray = [];

  for (let i = 1; i <= restProps.totalPages; i++) {
    goToPageArray.push(i);
  }
  useEffect(() => {
    if (restProps.totalPages === 1) {
      setPages([1]);
      restProps.onCurrentPageChange(restProps.currentPage);
    } else if (restProps.totalPages === 2) {
      setPages([1, 2]);
      restProps.onCurrentPageChange(restProps.currentPage - 1);
    } else if (restProps.totalPages === 3) {
      setPages([1, 2, 3]);
      restProps.onCurrentPageChange(restProps.currentPage - 1);
    } else if (restProps.totalPages === 4) {
      setPages([1, 2, 3, 4]);
      restProps.onCurrentPageChange(restProps.currentPage - 1);
    } else if (restProps.totalPages > 4) {
      restProps.onCurrentPageChange(restProps.currentPage - 1);
      setPages([1, 2, restProps.totalPages - 1, restProps.totalPages]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restProps.totalPages, restProps.pageSize]);

  useEffect(() => {
    if (pagesNextState) {
      if (restProps.currentPage + 2 > pages[1]) {
        if (
          restProps.currentPage + 2 !== restProps.totalPages - 1 &&
          restProps.currentPage + 2 !== restProps.totalPages
        ) {
          setPages([
            pages[0] + 1,
            pages[0] + 2,
            restProps.totalPages - 1,
            restProps.totalPages,
          ]);
        }
      }
      restProps.onCurrentPageChange(restProps.currentPage + 1);
      setPagesNextState(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagesNextState]);

  useEffect(() => {
    if (lastLimit) {
      if (restProps.currentPage + 1 === restProps.totalPages - 1) {
        setPages([
          restProps.totalPages - 3,
          restProps.totalPages - 2,
          restProps.totalPages - 1,
          restProps.totalPages,
        ]);
        restProps.onCurrentPageChange(restProps.currentPage);
        setLastLimit(false);
      } else if (restProps.currentPage + 1 === restProps.totalPages) {
        setPages([
          restProps.totalPages - 3,
          restProps.totalPages - 2,
          restProps.totalPages - 1,
          restProps.totalPages,
        ]);
        restProps.onCurrentPageChange(restProps.currentPage + 1);
        setLastLimit(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastLimit]);

  useEffect(() => {
    if (pagesPreviouseState) {
      if (restProps.currentPage < pages[0]) {
        setPages([
          pages[1] - 2,
          pages[1] - 1,
          restProps.totalPages - 1,
          restProps.totalPages,
        ]);
      }
      restProps.onCurrentPageChange(restProps.currentPage - 1);
      setPagesPreviousState(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagesPreviouseState]);

  let totalPages = [];

  for (let i = 1; i <= restProps.totalPages; i++) {
    totalPages.push(i);
  }

  var custoPagingProps = { ...restProps };
  custoPagingProps.totalPages = 0;

  return (
    <div className="flex flex-row items-center border-t-[1px] border-lightgray border-solid h-[50px]">
      <PagingPanel.Container
        className="flex flex-row justify-between w-[100%]"
        {...custoPagingProps}
      />
      <div className="flex flex-row justify-between items-center relative justify-self-end right-[120px]">
        <div className="w-[120px] h-[40px] bg-white">
          <div className="w-auto float-end flex flex-row items-center self-end mt-[-8px]">
            <ul className="pagination mt-2">
              <li
                className={
                  restProps.currentPage > 0
                    ? "page-item next cursor-pointer"
                    : "page-item next disabled"
                }>
                <div
                  // style={{ borderWidth: 0, cursor: "pointer" }}
                  onClick={() => {
                    setStartingRecords(startingRecords - restProps.pageSize);
                    if (endingRecords - startingRecords <= 3) {
                      setEndingRecords(endingRecords - restProps.pageSize + 1);
                    } else {
                      setEndingRecords(endingRecords - restProps.pageSize);
                    }
                    if (restProps.currentPage - 1 < pages[0]) {
                      setPagesPreviousState(true);
                    } else {
                      restProps.onCurrentPageChange(
                        restProps.currentPage === 0
                          ? restProps.currentPage
                          : restProps.currentPage - 1
                      );
                    }
                  }}
                  className="page-link border-0 cursor-pointer">
                  <div>{"<"}</div>
                </div>
              </li>
              <li
                className={
                  restProps.currentPage !== restProps.totalPages - 1
                    ? "page-item next cursor-pointer"
                    : "page-item next disabled"
                }>
                <div
                  // style={{ borderWidth: 0, cursor: "pointer" }}
                  onClick={() => {
                    setStartingRecords(startingRecords + restProps.pageSize);
                    if (restProps.totalCount - endingRecords < 5) {
                      setEndingRecords(
                        restProps.totalCount -
                          endingRecords +
                          startingRecords +
                          restProps.pageSize -
                          1
                      );
                    } else {
                      setEndingRecords(endingRecords + restProps.pageSize);
                    }
                    if (restProps.currentPage + 2 > pages[0]) {
                      setPagesNextState(true);
                    } else {
                      restProps.onCurrentPageChange(
                        restProps.currentPage === restProps.totalPages - 1
                          ? restProps.currentPage
                          : restProps.currentPage + 1
                      );
                    }
                  }}
                  className="page-link border-0 cursor-pointer">
                  <div>{">"}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPagination;
