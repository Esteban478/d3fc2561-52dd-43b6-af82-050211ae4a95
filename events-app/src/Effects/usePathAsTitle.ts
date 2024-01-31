import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {PATH, PAGE_TITLE} from '../Constant';

export const usePathAsTitle = (setTitle: (title: string) => void): void => {
    const location = useLocation();

    useEffect(() => {
        // Set the title based on the current route
        if (location.pathname === PATH.EVENTS) {
            setTitle(PAGE_TITLE.EVENTS);
        } else if (location.pathname === PATH.CART) {
            setTitle(PAGE_TITLE.CART);
        } else {
            setTitle(PAGE_TITLE.DEFAULT);
        }
    }, [location, setTitle]);
};