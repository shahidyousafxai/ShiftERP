import SearchIcon from "@mui/icons-material/Search";
import Close from "@mui/icons-material/Close";


export const SearchBar = ({
  onChange,
  value,
  onClear,
  onSearch,
  disabled,
  fromFilter,
  width,
}) => (
  <div
    className={`flex border flex-row align-items-center rounded p-2 focus-within:border-gray-300 focus-within:border-[1.5px] bg-bgGray h-[38px] 
    ${width ? `w-[${width}px]` : "w-full"}
    `}>
    <input
      disabled={disabled}
      onChange={onChange}
      value={value}
      className={`border-none bg-transparent outline-none resize-none w-full text-darkGray`}
      placeholder="Search"
      type="text"
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          onSearch && onSearch();
        }
      }}
    />
    {!fromFilter && (
      <>
        <div className="ms-2">
          <SearchIcon color="secondary" />
        </div>
        <div onClick={onClear} className="ms-2">
          {value && <Close color="secondary" />}
        </div>
      </>
    )}
  </div>
);
