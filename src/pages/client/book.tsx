
import BookClientDetail from "@/components/client/book/book.client.detail";
import BookLoader from "@/components/client/book/book.loader";
import { getBookWithIdAPI } from "@/services/api";
import { App } from "antd";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BookPage = () => {
    const { id } = useParams();
    const { notification } = App.useApp();
    const [book, setBook] = useState<IBookTable | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    useEffect(() => {
        if (id) {
            getBookWithID();
        }

    }, [id]);

    const getBookWithID = async () => {
        setIsLoading(true);
        const res = await getBookWithIdAPI(id!);
        if (res && res.data) {
            // console.log(res.data);
            setBook(res.data)
        } else {
            notification.error(
                {
                    message: "Error",
                    description: res.message
                }

            );
        }
        setIsLoading(false)
    }
    return (
        <div>
            {isLoading ?
                <BookLoader />
                :
                <BookClientDetail
                    book={book}
                />}

        </div>
    );
}
export default BookPage;