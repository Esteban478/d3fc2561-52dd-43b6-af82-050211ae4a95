import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  BadgeProps,
  InputBase,
  alpha,
  styled,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { PATH } from '../../../Constant';

interface TitleBarProps {
  searchText: string;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleResetFilter: () => void;
  cartItems: any[];
  handleOpenCart?: () => void;
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginRight: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const StyledBadge = styled(Badge)<BadgeProps>(() => ({
  '& .MuiBadge-badge': {
    right: 8,
    top: 16,
  },
}));

const TitleBar: React.FC<TitleBarProps> = ({
  searchText,
  handleSearch,
  handleResetFilter,
  cartItems,
  handleOpenCart,
}) => {
  const isCartPage = location.pathname === PATH.CART

  return (
    <Box sx={{ height: 64 }}>
      <AppBar position="fixed">
        <Toolbar>
          {!isCartPage && (
            <><Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                value={searchText}
                onChange={handleSearch} />
            </Search><IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="clear-filter"
              sx={{ mr: 4 }}
              onClick={handleResetFilter}
            >
                {searchText ? <FilterAltOffOutlinedIcon /> : <FilterAltOutlinedIcon />}
              </IconButton></>
            )}
          <StyledBadge sx={{ marginLeft: 'auto' }} badgeContent={cartItems.length} color="secondary">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="shopping-cart"
              disabled={cartItems.length === 0}
              onClick={handleOpenCart}
            >
              <ShoppingCartOutlinedIcon />
            </IconButton>
          </StyledBadge>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default TitleBar;